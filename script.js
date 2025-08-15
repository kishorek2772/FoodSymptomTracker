// Food-Symptom mapping database
const FOOD_SYMPTOM_MAP = {
    // Dairy products
    'milk': ['bloating', 'diarrhea', 'stomach_pain', 'nausea'],
    'cheese': ['bloating', 'diarrhea', 'stomach_pain', 'nausea'],
    'yogurt': ['bloating', 'diarrhea', 'stomach_pain'],
    'butter': ['bloating', 'stomach_pain'],
    'cream': ['bloating', 'diarrhea', 'nausea'],
    'ice cream': ['bloating', 'diarrhea', 'stomach_pain', 'nausea'],
    
    // Gluten/Wheat
    'bread': ['bloating', 'fatigue', 'headache', 'stomach_pain'],
    'wheat': ['bloating', 'fatigue', 'headache', 'stomach_pain'],
    'pasta': ['bloating', 'fatigue', 'stomach_pain'],
    'pizza': ['bloating', 'heartburn', 'stomach_pain'],
    'cereal': ['bloating', 'fatigue'],
    'cookies': ['bloating', 'fatigue', 'headache'],
    'cake': ['bloating', 'fatigue', 'headache'],
    
    // Proteins
    'eggs': ['skin_rash', 'nausea', 'stomach_pain'],
    'chicken': ['nausea', 'stomach_pain'],
    'beef': ['stomach_pain', 'bloating'],
    'pork': ['stomach_pain', 'nausea'],
    
    // Nuts
    'nuts': ['skin_rash', 'itching', 'stomach_pain'],
    'peanuts': ['skin_rash', 'itching'],
    'almonds': ['skin_rash', 'stomach_pain'],
    'walnuts': ['skin_rash', 'stomach_pain'],
    
    // Seafood
    'fish': ['skin_rash', 'itching', 'nausea'],
    'salmon': ['skin_rash', 'nausea'],
    'tuna': ['skin_rash', 'nausea'],
    'shrimp': ['skin_rash', 'itching'],
    'crab': ['skin_rash', 'itching', 'nausea'],
    
    // Vegetables
    'tomatoes': ['heartburn', 'skin_rash'],
    'onions': ['heartburn', 'stomach_pain'],
    'garlic': ['heartburn', 'stomach_pain'],
    'peppers': ['heartburn', 'stomach_pain'],
    
    // Fruits
    'orange': ['heartburn', 'skin_rash'],
    'lemon': ['heartburn'],
    'strawberries': ['skin_rash', 'itching'],
    'apples': ['bloating', 'stomach_pain'],
    
    // Beverages
    'coffee': ['heartburn', 'headache', 'fatigue'],
    'tea': ['headache', 'heartburn'],
    'alcohol': ['headache', 'nausea', 'fatigue'],
    'wine': ['headache', 'nausea'],
    'beer': ['bloating', 'headache'],
    'soda': ['bloating', 'heartburn'],
    
    // Sweets and processed
    'chocolate': ['headache', 'heartburn'],
    'candy': ['headache', 'fatigue'],
    'chips': ['bloating', 'heartburn'],
    
    // Spicy foods
    'spicy': ['heartburn', 'stomach_pain'],
    'curry': ['heartburn', 'stomach_pain'],
    'chili': ['heartburn', 'stomach_pain'],
    
    // Soy products
    'soy': ['bloating', 'skin_rash', 'stomach_pain'],
    'tofu': ['bloating', 'stomach_pain']
};

// App state
let selectedSymptoms = [];
let foodList = [];
let currentStep = 1;

// DOM elements
const steps = document.querySelectorAll('.step');
const symptomButtons = document.querySelectorAll('.symptom-btn');
const selectedSymptomsDiv = document.getElementById('selected-symptoms');
const nextToFoodsBtn = document.getElementById('next-to-foods');
const foodInput = document.getElementById('food-input');
const addFoodBtn = document.getElementById('add-food');
const foodListDiv = document.getElementById('food-list');
const backToSymptomsBtn = document.getElementById('back-to-symptoms');
const analyzeBtn = document.getElementById('analyze');
const resultsDiv = document.getElementById('results');
const backToFoodsBtn = document.getElementById('back-to-foods');
const startOverBtn = document.getElementById('start-over');

// Initialize app
function init() {
    setupEventListeners();
    showStep(1);
}

function setupEventListeners() {
    // Symptom selection
    symptomButtons.forEach(btn => {
        btn.addEventListener('click', () => toggleSymptom(btn.dataset.symptom, btn.textContent));
    });
    
    // Navigation buttons
    nextToFoodsBtn.addEventListener('click', () => showStep(2));
    backToSymptomsBtn.addEventListener('click', () => showStep(1));
    backToFoodsBtn.addEventListener('click', () => showStep(2));
    startOverBtn.addEventListener('click', startOver);
    
    // Food input
    addFoodBtn.addEventListener('click', addFood);
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addFood();
    });
    
    // Analyze button
    analyzeBtn.addEventListener('click', analyzeSymptoms);
}

function showStep(stepNumber) {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
    currentStep = stepNumber;
}

function toggleSymptom(symptomId, symptomName) {
    const index = selectedSymptoms.findIndex(s => s.id === symptomId);
    const button = document.querySelector(`[data-symptom="${symptomId}"]`);
    
    if (index > -1) {
        // Remove symptom
        selectedSymptoms.splice(index, 1);
        button.classList.remove('selected');
    } else {
        // Add symptom
        selectedSymptoms.push({ id: symptomId, name: symptomName });
        button.classList.add('selected');
    }
    
    updateSelectedSymptomsDisplay();
    updateNextButton();
}

function updateSelectedSymptomsDisplay() {
    selectedSymptomsDiv.innerHTML = '';
    selectedSymptoms.forEach(symptom => {
        const div = document.createElement('div');
        div.className = 'selected-symptom';
        div.innerHTML = `
            ${symptom.name}
            <button class="remove-symptom" onclick="removeSymptom('${symptom.id}')">×</button>
        `;
        selectedSymptomsDiv.appendChild(div);
    });
}

function removeSymptom(symptomId) {
    const button = document.querySelector(`[data-symptom="${symptomId}"]`);
    button.classList.remove('selected');
    selectedSymptoms = selectedSymptoms.filter(s => s.id !== symptomId);
    updateSelectedSymptomsDisplay();
    updateNextButton();
}

function updateNextButton() {
    nextToFoodsBtn.disabled = selectedSymptoms.length === 0;
}

function addFood() {
    const foodName = foodInput.value.trim();
    if (!foodName) return;
    
    const food = {
        id: Date.now(),
        name: foodName,
        timestamp: new Date().toLocaleDateString()
    };
    
    foodList.unshift(food);
    foodInput.value = '';
    updateFoodListDisplay();
    updateAnalyzeButton();
}

function updateFoodListDisplay() {
    foodListDiv.innerHTML = '';
    foodList.forEach(food => {
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `
            <span class="food-name">${food.name}</span>
            <button class="remove-food" onclick="removeFood(${food.id})">Remove</button>
        `;
        foodListDiv.appendChild(div);
    });
}

function removeFood(foodId) {
    foodList = foodList.filter(f => f.id !== foodId);
    updateFoodListDisplay();
    updateAnalyzeButton();
}

function updateAnalyzeButton() {
    analyzeBtn.disabled = foodList.length === 0;
}

function analyzeSymptoms() {
    const predictions = [];
    const userSymptomIds = selectedSymptoms.map(s => s.id);
    
    // Check each food against symptoms
    foodList.forEach(food => {
        const foodName = food.name.toLowerCase();
        let matchingSymptoms = [];
        let confidence = 0;
        
        // Check direct matches in our database
        Object.keys(FOOD_SYMPTOM_MAP).forEach(trigger => {
            if (foodName.includes(trigger)) {
                const foodSymptoms = FOOD_SYMPTOM_MAP[trigger];
                const matches = foodSymptoms.filter(symptom => 
                    userSymptomIds.includes(symptom)
                );
                
                if (matches.length > 0) {
                    matchingSymptoms = [...new Set([...matchingSymptoms, ...matches])];
                }
            }
        });
        
        // Calculate confidence based on matches
        if (matchingSymptoms.length > 0) {
            confidence = Math.min(matchingSymptoms.length * 30 + 20, 95);
            
            const reasons = matchingSymptoms.map(symptomId => {
                const symptom = selectedSymptoms.find(s => s.id === symptomId);
                return `May cause ${symptom ? symptom.name.toLowerCase() : symptomId}`;
            });
            
            predictions.push({
                food: food.name,
                confidence: confidence,
                reasons: reasons
            });
        }
    });
    
    // Sort by confidence
    predictions.sort((a, b) => b.confidence - a.confidence);
    
    // If no predictions, add some general ones
    if (predictions.length === 0) {
        const generalPredictions = [];
        
        // Check for common trigger categories
        if (userSymptomIds.some(id => ['bloating', 'diarrhea', 'stomach_pain', 'nausea'].includes(id))) {
            generalPredictions.push({
                food: 'Dairy Products (General)',
                confidence: 60,
                reasons: ['Lactose intolerance is very common', 'Often causes digestive symptoms']
            });
            
            generalPredictions.push({
                food: 'Gluten-containing Foods',
                confidence: 55,
                reasons: ['Gluten sensitivity affects many people', 'Can cause bloating and discomfort']
            });
        }
        
        if (userSymptomIds.some(id => ['skin_rash', 'itching'].includes(id))) {
            generalPredictions.push({
                food: 'Common Allergens (Nuts, Eggs, Shellfish)',
                confidence: 70,
                reasons: ['These are the most common food allergens', 'Often cause skin reactions']
            });
        }
        
        predictions.push(...generalPredictions);
    }
    
    displayResults(predictions);
    showStep(3);
}

function displayResults(predictions) {
    if (predictions.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <h3>No Clear Patterns Found</h3>
                <p>We couldn't identify strong correlations between your foods and symptoms.</p>
                <p>Consider keeping a more detailed food diary or consulting a healthcare professional.</p>
            </div>
        `;
        return;
    }
    
    resultsDiv.innerHTML = predictions.map(prediction => `
        <div class="prediction">
            <div class="prediction-header">
                <div class="food-name-result">${prediction.food}</div>
                <div class="confidence">${prediction.confidence}%</div>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
            </div>
            <div class="reasons">
                <h4>Possible reasons:</h4>
                <ul>
                    ${prediction.reasons.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function startOver() {
    selectedSymptoms = [];
    foodList = [];
    
    // Reset UI
    symptomButtons.forEach(btn => btn.classList.remove('selected'));
    selectedSymptomsDiv.innerHTML = '';
    foodListDiv.innerHTML = '';
    foodInput.value = '';
    resultsDiv.innerHTML = '';
    
    updateNextButton();
    updateAnalyzeButton();
    showStep(1);
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);