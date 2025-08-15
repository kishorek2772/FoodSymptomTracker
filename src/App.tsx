import  { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Apple, 
  Brain, 
  Calendar, 
  CheckCircle, 
  Download,
  Heart,
  Info,
  Plus,
  Star,
  TrendingUp,
  Users,
  X
} from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  severity: number;
  category: string;
}

interface FoodItem {
  id: string;
  name: string;
  timestamp: string;
  category: string;
}

interface Prediction {
  food: string;
  confidence: number;
  reasons: string[];
  category: string;
}

const COMMON_SYMPTOMS = [
  { id: 'nausea', name: 'Nausea', category: 'Digestive' },
  { id: 'bloating', name: 'Bloating', category: 'Digestive' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'Digestive' },
  { id: 'constipation', name: 'Constipation', category: 'Digestive' },
  { id: 'stomach_pain', name: 'Stomach Pain', category: 'Digestive' },
  { id: 'heartburn', name: 'Heartburn', category: 'Digestive' },
  { id: 'headache', name: 'Headache', category: 'Neurological' },
  { id: 'fatigue', name: 'Fatigue', category: 'General' },
  { id: 'skin_rash', name: 'Skin Rash', category: 'Allergic' },
  { id: 'itching', name: 'Itching', category: 'Allergic' },
  { id: 'runny_nose', name: 'Runny Nose', category: 'Respiratory' },
  { id: 'difficulty_breathing', name: 'Difficulty Breathing', category: 'Respiratory' },
];

const FOOD_CATEGORIES = [
  'Dairy', 'Grains', 'Nuts', 'Seafood', 'Fruits', 'Vegetables', 
  'Meat', 'Beverages', 'Spices', 'Processed Foods'
];

const FOOD_SYMPTOM_MAP: { [key: string]: string[] } = {
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
  
  // Nuts and seeds
  'nuts': ['skin_rash', 'itching', 'difficulty_breathing', 'stomach_pain'],
  'peanuts': ['skin_rash', 'itching', 'difficulty_breathing'],
  'almonds': ['skin_rash', 'stomach_pain'],
  'walnuts': ['skin_rash', 'stomach_pain'],
  
  // Seafood
  'fish': ['skin_rash', 'itching', 'nausea'],
  'salmon': ['skin_rash', 'nausea'],
  'tuna': ['skin_rash', 'nausea'],
  'shrimp': ['skin_rash', 'itching', 'difficulty_breathing'],
  'crab': ['skin_rash', 'itching', 'nausea'],
  
  // Vegetables
  'tomatoes': ['heartburn', 'skin_rash'],
  'onions': ['heartburn', 'stomach_pain'],
  'garlic': ['heartburn', 'stomach_pain'],
  'peppers': ['heartburn', 'stomach_pain'],
  
  // Fruits
  'citrus': ['heartburn', 'skin_rash'],
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
  
  // Spices and seasonings
  'spicy': ['heartburn', 'stomach_pain'],
  'curry': ['heartburn', 'stomach_pain'],
  'chili': ['heartburn', 'stomach_pain'],
  
  // Soy products
  'soy': ['bloating', 'skin_rash', 'stomach_pain'],
  'tofu': ['bloating', 'stomach_pain'],
};

function App() {
  const [currentStep, setCurrentStep] = useState<'symptoms' | 'foods' | 'results'>('symptoms');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('foodSymptomData');
    if (savedData) {
      const { symptoms: savedSymptoms, foods: savedFoods } = JSON.parse(savedData);
      setSymptoms(savedSymptoms || []);
      setFoods(savedFoods || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('foodSymptomData', JSON.stringify({ symptoms, foods }));
  }, [symptoms, foods]);

  const addSymptom = (symptomData: typeof COMMON_SYMPTOMS[0]) => {
    if (symptoms.find(s => s.id === symptomData.id)) return;
    
    const newSymptom: Symptom = {
      id: symptomData.id,
      name: symptomData.name,
      severity: 5,
      category: symptomData.category
    };
    
    setSymptoms([...symptoms, newSymptom]);
  };

  const updateSymptomSeverity = (id: string, severity: number) => {
    setSymptoms(symptoms.map(s => 
      s.id === id ? { ...s, severity } : s
    ));
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const addFood = () => {
    if (!newFoodName.trim()) return;
    
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: newFoodName.trim(),
      timestamp: new Date().toISOString(),
      category: selectedCategory || 'Other'
    };
    
    setFoods([newFood, ...foods]);
    setNewFoodName('');
    setSelectedCategory('');
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  const generatePredictions = () => {
    const predictions: Prediction[] = [];
    const foodScores: { [key: string]: { score: number, reasons: string[], matchCount: number } } = {};

    // Simple matching algorithm
    foods.forEach(food => {
      const foodName = food.name.toLowerCase();
      let score = 0;
      const reasons: string[] = [];
      let matchCount = 0;

      // Check if food name contains any trigger words
      Object.entries(FOOD_SYMPTOM_MAP).forEach(([trigger, associatedSymptoms]) => {
        if (foodName.includes(trigger)) {
          // Check how many user symptoms match this food's known symptoms
          associatedSymptoms.forEach(symptomId => {
            const userSymptom = symptoms.find(s => s.id === symptomId);
            if (userSymptom) {
              matchCount++;
              score += userSymptom.severity;
              reasons.push(`${food.name} may cause ${userSymptom.name}`);
            }
          });
        }
      });

      // If we found matches, calculate confidence
      if (matchCount > 0) {
        // Base confidence on number of matching symptoms and their severity
        const confidence = Math.min((matchCount * 20) + (score * 2), 95);
        
        foodScores[food.name] = { 
          score: confidence, 
          reasons: reasons.slice(0, 3),
          matchCount 
        };
      }
      
      // Also add some general predictions for common foods even without exact matches
      if (matchCount === 0) {
        // Check for partial matches or common problematic foods
        const commonTriggers = ['dairy', 'gluten', 'spicy', 'fried', 'processed'];
        commonTriggers.forEach(trigger => {
          if (foodName.includes(trigger) || 
              (trigger === 'dairy' && (foodName.includes('milk') || foodName.includes('cheese'))) ||
              (trigger === 'gluten' && (foodName.includes('bread') || foodName.includes('wheat'))) ||
              (trigger === 'spicy' && foodName.includes('hot')) ||
              (trigger === 'fried' && (foodName.includes('fried') || foodName.includes('fry'))) ||
              (trigger === 'processed' && (foodName.includes('fast') || foodName.includes('junk')))) {
            
            // Give a lower confidence score for general matches
            const generalScore = Math.min(symptoms.length * 15, 60);
            if (generalScore > 0) {
              foodScores[food.name] = { 
                score: generalScore, 
                reasons: [`${food.name} is a common trigger food`, `May cause digestive issues in sensitive individuals`],
                matchCount: 1
              };
            }
          }
        });
      }
    });

    // Convert to predictions array and sort by score
    Object.entries(foodScores)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 5)
      .forEach(([foodName, data]) => {
        const food = foods.find(f => f.name === foodName);
        predictions.push({
          food: foodName,
          confidence: Math.round(data.score),
          reasons: data.reasons,
          category: food?.category || 'Unknown'
        });
      });
    
    // If still no predictions, create some general ones based on symptoms
    if (predictions.length === 0 && symptoms.length > 0) {
      const generalPredictions = [];
      
      // Check for digestive symptoms
      const digestiveSymptoms = symptoms.filter(s => 
        ['bloating', 'diarrhea', 'constipation', 'stomach_pain', 'nausea', 'heartburn'].includes(s.id)
      );
      
      if (digestiveSymptoms.length > 0) {
        generalPredictions.push({
          food: 'Dairy Products (General)',
          confidence: Math.min(digestiveSymptoms.length * 25, 75),
          reasons: ['Lactose intolerance is very common', 'Dairy often causes digestive issues'],
          category: 'Dairy'
        });
        
        generalPredictions.push({
          food: 'Gluten-containing Foods',
          confidence: Math.min(digestiveSymptoms.length * 20, 65),
          reasons: ['Gluten sensitivity affects many people', 'Can cause bloating and digestive discomfort'],
          category: 'Grains'
        });
      }
      
      // Check for allergic symptoms
      const allergicSymptoms = symptoms.filter(s => 
        ['skin_rash', 'itching', 'difficulty_breathing'].includes(s.id)
      );
      
      if (allergicSymptoms.length > 0) {
        generalPredictions.push({
          food: 'Common Allergens (Nuts, Eggs, Shellfish)',
          confidence: Math.min(allergicSymptoms.length * 30, 80),
          reasons: ['These are the most common food allergens', 'Can cause skin and respiratory reactions'],
          category: 'Allergens'
        });
      }
      
      setPredictions(generalPredictions.slice(0, 3));
    } else {
      setPredictions(predictions);
    }

    setCurrentStep('results');
  };

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      symptoms: symptoms.map(s => `${s.name} (Severity: ${s.severity}/10)`),
      foods: foods.map(f => `${f.name} (${new Date(f.timestamp).toLocaleDateString()})`),
      predictions: predictions.map(p => `${p.food}: ${p.confidence}% confidence - ${p.reasons.join(', ')}`)
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `food-symptom-analysis-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-lg">
                <Apple className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FoodSense</h1>
                <p className="text-sm text-gray-600">Smart Food Symptom Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Step {currentStep === 'symptoms' ? '1' : currentStep === 'foods' ? '2' : '3'} of 3</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center space-x-2 ${currentStep === 'symptoms' ? 'text-blue-600' : 'text-green-600'}`}>
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Symptoms</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'foods' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Food History</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ${
                currentStep === 'symptoms' ? 'w-1/3' : currentStep === 'foods' ? 'w-2/3' : 'w-full'
              }`}
            ></div>
          </div>
        </div>

        {/* Step 1: Symptoms */}
        {currentStep === 'symptoms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="h-6 w-6 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">What symptoms are you experiencing?</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {COMMON_SYMPTOMS.map(symptom => (
                  <button
                    key={symptom.id}
                    onClick={() => addSymptom(symptom)}
                    disabled={symptoms.some(s => s.id === symptom.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                      symptoms.some(s => s.id === symptom.id)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{symptom.name}</span>
                      {symptoms.some(s => s.id === symptom.id) && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{symptom.category}</span>
                  </button>
                ))}
              </div>

              {/* Selected Symptoms */}
              {symptoms.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Symptoms (1-10 severity)</h3>
                  <div className="space-y-4">
                    {symptoms.map(symptom => (
                      <div key={symptom.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">{symptom.name}</span>
                          <span className="text-sm text-gray-500">({symptom.category})</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={symptom.severity}
                            onChange={(e) => updateSymptomSeverity(symptom.id, parseInt(e.target.value))}
                            className="w-24"
                          />
                          <span className="w-8 text-center font-medium text-blue-600">{symptom.severity}</span>
                          <button
                            onClick={() => removeSymptom(symptom.id)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setCurrentStep('foods')}
                  disabled={symptoms.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Food History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Food History */}
        {currentStep === 'foods' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">What have you eaten recently?</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter food name..."
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFood()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {FOOD_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  onClick={addFood}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Food</span>
                </button>
              </div>

              {/* Food List */}
              {foods.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Foods</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {foods.map(food => (
                      <div key={food.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{food.name}</div>
                          <div className="text-sm text-gray-500">
                            {food.category} • {new Date(food.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFood(food.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep('symptoms')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Back to Symptoms
                </button>
                <button
                  onClick={generatePredictions}
                  disabled={foods.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze & Get Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 'results' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                </div>
                <button
                  onClick={exportResults}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>

              {predictions.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Analysis Complete</p>
                        <p>Based on your symptoms and food history, here are the most likely triggers. This is for informational purposes only - consult a healthcare professional for medical advice.</p>
                      </div>
                    </div>
                  </div>

                  {predictions.map((prediction, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-900">{prediction.food}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{prediction.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span className="text-lg font-bold text-orange-600">{prediction.confidence}%</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Possible reasons:</h4>
                        <ul className="space-y-1">
                          {prediction.reasons.map((reason, reasonIndex) => (
                            <li key={reasonIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-2">Recommendations:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Consider keeping a detailed food diary</li>
                          <li>Try an elimination diet under professional guidance</li>
                          <li>Consult with a healthcare provider or registered dietitian</li>
                          <li>Consider allergy testing if symptoms are severe</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Clear Patterns Found</h3>
                  <p className="text-gray-600 mb-6">We couldn't identify strong correlations between your foods and symptoms. This could mean:</p>
                  <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                    <li>• Your symptoms may not be food-related</li>
                    <li>• You may need to track foods for a longer period</li>
                    <li>• The trigger foods weren't included in your list</li>
                  </ul>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep('foods')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Back to Foods
                </button>
                <button
                  onClick={() => {
                    setSymptoms([]);
                    setFoods([]);
                    setPredictions([]);
                    setCurrentStep('symptoms');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Start New Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      
    </div>
  );
}

export default App;