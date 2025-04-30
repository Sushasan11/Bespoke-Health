const { spawn } = require("child_process");
const path = require("path");

const predictDisease = (symptoms) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../services/disease_predictor.py"),
    ]);

    let result = "";
    let errorData = "";

    
    pythonProcess.stdin.write(JSON.stringify(symptoms));
    pythonProcess.stdin.end();

    
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    
    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Error output: ${errorData}`);
        reject(
          new Error(`Disease prediction failed with code ${code}: ${errorData}`)
        );
      } else {
        try {
          const prediction = JSON.parse(result);
          resolve(prediction);
        } catch (error) {
          console.error("Failed to parse prediction result:", error);
          reject(error);
        }
      }
    });
  });
};

const predictDiseaseAPI = async (req, res) => {
  try {
    const { symptoms } = req.body;

    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        error: "Please provide an array of symptoms",
      });
    }

    
    const prediction = await predictDisease(symptoms);

    
    
    if (req.user && req.user.role === "Patient") {
      try {
        await prisma.diseasePrediction.create({
          data: {
            patient_id: req.user.patientProfile.id,
            symptoms: JSON.stringify(symptoms),
            predicted_disease: prediction.disease_name,
            confidence: prediction.confidence,
            created_at: new Date(),
          },
        });
      } catch (dbError) {
        console.error("Failed to save prediction:", dbError);
        
      }
    }

    
    res.status(200).json({
      success: true,
      prediction: {
        disease: prediction.disease_name,
        confidence: prediction.confidence * 100,
        symptoms_provided: symptoms,
      },
      disclaimer:
        "This prediction is based on machine learning and should not replace professional medical advice.",
    });
  } catch (error) {
    console.error("Disease prediction error:", error);
    res.status(500).json({
      error: "Failed to predict disease",
      message: error.message,
    });
  }
};


const getAllSymptoms = (req, res) => {
  
  const allSymptoms = [
    "itching",
    "skin_rash",
    "nodal_skin_eruptions",
    "continuous_sneezing",
    "shivering",
    "chills",
    "joint_pain",
    "stomach_pain",
    "acidity",
    "ulcers_on_tongue",
    "muscle_wasting",
    "vomiting",
    "burning_micturition",
    "spotting_urination",
    "fatigue",
    "weight_gain",
    "anxiety",
    "cold_hands_and_feets",
    "mood_swings",
    "weight_loss",
    "restlessness",
    "lethargy",
    "patches_in_throat",
    "irregular_sugar_level",
    "cough",
    "high_fever",
    "sunken_eyes",
    "breathlessness",
    "sweating",
    "dehydration",
    "indigestion",
    "headache",
    "yellowish_skin",
    "dark_urine",
    "nausea",
    "loss_of_appetite",
    "pain_behind_the_eyes",
    "back_pain",
    "constipation",
    "abdominal_pain",
    "diarrhoea",
    "mild_fever",
    "yellow_urine",
    "yellowing_of_eyes",
    "acute_liver_failure",
    "fluid_overload",
    "swelling_of_stomach",
    "swelled_lymph_nodes",
    "malaise",
    "blurred_and_distorted_vision",
    "phlegm",
    "throat_irritation",
    "redness_of_eyes",
    "sinus_pressure",
    "runny_nose",
    "congestion",
    "chest_pain",
    "weakness_in_limbs",
    "fast_heart_rate",
    "pain_during_bowel_movements",
    "pain_in_anal_region",
    "bloody_stool",
    "irritation_in_anus",
    "neck_pain",
    "dizziness",
    "cramps",
    "bruising",
    "obesity",
    "swollen_legs",
    "swollen_blood_vessels",
    "puffy_face_and_eyes",
    "enlarged_thyroid",
    "brittle_nails",
    "swollen_extremeties",
    "excessive_hunger",
    "extra_marital_contacts",
    "drying_and_tingling_lips",
    "slurred_speech",
    "knee_pain",
    "hip_joint_pain",
    "muscle_weakness",
    "stiff_neck",
    "swelling_joints",
    "movement_stiffness",
    "spinning_movements",
    "loss_of_balance",
    "unsteadiness",
    "weakness_of_one_body_side",
    "loss_of_smell",
    "bladder_discomfort",
    "foul_smell_of_urine",
    "continuous_feel_of_urine",
    "passage_of_gases",
    "internal_itching",
    "toxic_look_(typhos)",
    "depression",
    "irritability",
    "muscle_pain",
    "altered_sensorium",
    "red_spots_over_body",
    "belly_pain",
    "abnormal_menstruation",
    "dischromic_patches",
    "watering_from_eyes",
    "increased_appetite",
    "polyuria",
    "family_history",
    "mucoid_sputum",
    "rusty_sputum",
    "lack_of_concentration",
    "visual_disturbances",
    "receiving_blood_transfusion",
    "receiving_unsterile_injections",
    "coma",
    "stomach_bleeding",
    "distention_of_abdomen",
    "history_of_alcohol_consumption",
    "fluid_overload_1",
    "blood_in_sputum",
    "prominent_veins_on_calf",
    "palpitations",
    "painful_walking",
    "pus_filled_pimples",
    "blackheads",
    "scurring",
    "skin_peeling",
    "silver_like_dusting",
    "small_dents_in_nails",
    "inflammatory_nails",
    "blister",
    "red_sore_around_nose",
    "yellow_crust_ooze",
  ];

  res.status(200).json({
    success: true,
    symptoms: allSymptoms,
    count: allSymptoms.length,
  });
};

module.exports = {
  predictDiseaseAPI,
  getAllSymptoms,
};
