// Initialize Lucide icons
lucide.createIcons();

// Tab switching functionality
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Update button styles
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        button.classList.remove('bg-gray-200', 'text-gray-700');
        button.classList.add('bg-blue-600', 'text-white');

        // Show selected tab content
        const tabId = button.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(tabId).classList.remove('hidden');
    });
});

// Form submission handler
document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');
    const noResultsDiv = document.getElementById('noResults');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="brain" class="mr-2 animate-pulse"></i> Predicting...';
    lucide.createIcons();
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to make prediction');
        }
        
        const result = await response.json();
        
        // Update UI with results
        document.getElementById('processingTime').textContent = 
            `Processed in ${result.metadata.processing_time.toFixed(2)}ms using ${result.metadata.model_used}`;
        document.getElementById('confidence').textContent = 
            `Overall Confidence: ${(result.metadata.confidence * 100).toFixed(1)}%`;
        
        // Update predictions list
        const predictionsList = document.getElementById('predictionsList');
        predictionsList.innerHTML = result.names.map(pred => `
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                <div class="flex items-center">
                    <div class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <i data-lucide="user" style="width: 16px; height: 16px;"></i>
                    </div>
                    <span class="font-medium">${pred.name}</span>
                </div>
                <div class="flex flex-col items-end">
                    <span class="font-bold ${getConfidenceColor(pred.confidence)}">
                        ${(pred.confidence * 100).toFixed(1)}%
                    </span>
                    <span class="text-xs text-gray-500">Rank #${pred.rank}</span>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
        
        // Update data quality
        const dataQuality = result.metadata.data_quality;
        document.getElementById('dataQuality').textContent = `${(dataQuality * 100).toFixed(0)}%`;
        document.getElementById('dataQualityBar').style.width = `${dataQuality * 100}%`;
        
        const dataQualityText = document.getElementById('dataQualityText');
        if (dataQuality > 0.8) {
            dataQualityText.textContent = 'High quality data with good demographic representation.';
        } else if (dataQuality > 0.6) {
            dataQualityText.textContent = 'Moderate data quality. Some demographic groups may be underrepresented.';
        } else {
            dataQualityText.textContent = 'Low data quality. Results may be less reliable for this demographic profile.';
        }
        
        // Show results
        errorDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        noResultsDiv.classList.add('hidden');
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="brain" class="mr-2"></i> Predict Name';
        lucide.createIcons();
    }
});

function getConfidenceColor(confidence) {
    if (confidence > 0.7) return 'text-green-600';
    if (confidence > 0.4) return 'text-amber-600';
    return 'text-red-600';
} 