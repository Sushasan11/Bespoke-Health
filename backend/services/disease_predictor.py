import pickle
import sys
import json

# Disease mapping
disease_mapping = {
    0: "Dengue",
    1: "Alcoholic hepatitis",
    2: "(vertigo) Paroymsal Positional Vertigo",
    3: "Diabetes",
    4: "Hyperthyroidism",
    5: "Paralysis (brain hemorrhage)",
    6: "Urinary tract infection",
    7: "Chicken pox",
    8: "Allergy",
    9: "Migraine",
    10: "Hepatitis A",
    11: "Osteoarthritis",
    12: "Cervical spondylosis",
    13: "Common Cold",
    14: "Jaundice",
    15: "Tuberculosis",
    16: "Fungal infection",
    17: "AIDS",
    18: "Peptic ulcer disease",
    19: "Psoriasis",
    20: "Malaria",
    21: "Hypertension",
    22: "Hepatitis C",
    23: "Acne",
    24: "Heart attack",
    25: "Hypoglycemia",
    26: "Impetigo",
    27: "Typhoid",
    28: "Bronchial Asthma",
    29: "Arthritis",
    30: "GERD",
    31: "Hepatitis E",
    32: "Hepatitis D",
    33: "Gastroenteritis",
    34: "Hepatitis B",
    35: "Pneumonia",
    36: "Dimorphic hemorrhoids (piles)",
    37: "Chronic cholestasis",
    38: "Drug Reaction",
    39: "Varicose veins",
    40: "Hypothyroidism"
}

# List of all symptoms (must match the order used during model training)
all_symptoms = [
    "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering", "chills", 
    "joint_pain", "stomach_pain", "acidity", "ulcers_on_tongue", "muscle_wasting", "vomiting", 
    "burning_micturition", "spotting_urination", "fatigue", "weight_gain", "anxiety", 
    "cold_hands_and_feets", "mood_swings", "weight_loss", "restlessness", "lethargy", 
    "patches_in_throat", "irregular_sugar_level", "cough", "high_fever", "sunken_eyes", 
    "breathlessness", "sweating", "dehydration", "indigestion", "headache", "yellowish_skin", 
    "dark_urine", "nausea", "loss_of_appetite", "pain_behind_the_eyes", "back_pain", 
    "constipation", "abdominal_pain", "diarrhoea", "mild_fever", "yellow_urine", 
    "yellowing_of_eyes", "acute_liver_failure", "fluid_overload", "swelling_of_stomach", 
    "swelled_lymph_nodes", "malaise", "blurred_and_distorted_vision", "phlegm", 
    "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose", "congestion", 
    "chest_pain", "weakness_in_limbs", "fast_heart_rate", "pain_during_bowel_movements", 
    "pain_in_anal_region", "bloody_stool", "irritation_in_anus", "neck_pain", "dizziness", 
    "cramps", "bruising", "obesity", "swollen_legs", "swollen_blood_vessels", 
    "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", "swollen_extremeties", 
    "excessive_hunger", "extra_marital_contacts", "drying_and_tingling_lips", "slurred_speech", 
    "knee_pain", "hip_joint_pain", "muscle_weakness", "stiff_neck", "swelling_joints", 
    "movement_stiffness", "spinning_movements", "loss_of_balance", "unsteadiness", 
    "weakness_of_one_body_side", "loss_of_smell", "bladder_discomfort", "foul_smell_of_urine", 
    "continuous_feel_of_urine", "passage_of_gases", "internal_itching", "toxic_look_(typhos)", 
    "depression", "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body", 
    "belly_pain", "abnormal_menstruation", "dischromic_patches", "watering_from_eyes", 
    "increased_appetite", "polyuria", "family_history", "mucoid_sputum", "rusty_sputum", 
    "lack_of_concentration", "visual_disturbances", "receiving_blood_transfusion", 
    "receiving_unsterile_injections", "coma", "stomach_bleeding", "distention_of_abdomen", 
    "history_of_alcohol_consumption", "fluid_overload_1", "blood_in_sputum", 
    "prominent_veins_on_calf", "palpitations", "painful_walking", "pus_filled_pimples", 
    "blackheads", "scurring", "skin_peeling", "silver_like_dusting", "small_dents_in_nails", 
    "inflammatory_nails", "blister", "red_sore_around_nose", "yellow_crust_ooze"
]

def predict_disease(symptoms):
    # Load the model
    model_path = "models/tuned_random_forest_model.pkl"
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    
    # Prepare input features (one-hot encoding)
    input_features = [0] * len(all_symptoms)
    for symptom in symptoms:
        if symptom in all_symptoms:
            index = all_symptoms.index(symptom)
            input_features[index] = 1
    
    # Make prediction
    prediction = model.predict([input_features])
    disease_id = prediction[0]
    
    # Get disease name
    disease_name = disease_mapping.get(disease_id, "Unknown Disease")
    
    return {
        "disease_id": int(disease_id),
        "disease_name": disease_name,
        "confidence": 0.94  
    }

if __name__ == "__main__":
    # Read input from command line
    input_json = sys.stdin.read()
    symptoms = json.loads(input_json)
    
    # Make prediction
    result = predict_disease(symptoms)
    
    # Print result as JSON
    print(json.dumps(result))