import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DiseasePredictionService from "../../services/DiseasePredictionService";

const DiseasePredictionPage = () => {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPulse, setShowPulse] = useState(false);

  
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await DiseasePredictionService.getAllSymptoms();
        setAllSymptoms(response.symptoms || []);
      } catch (error) {
        toast.error(error.error || "Failed to load symptoms");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  
  const filteredSymptoms = searchTerm
    ? allSymptoms.filter((symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allSymptoms;

  
  const toggleSymptom = (symptom) => {
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 700);

    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    try {
      setLoading(true);
      setPrediction(null);

      const response = await DiseasePredictionService.predictDisease(
        selectedSymptoms
      );
      setPrediction(response.prediction);

      
      toast.success("Disease prediction completed");
    } catch (error) {
      toast.error(error.error || "Failed to predict disease");
    } finally {
      setLoading(false);
    }
  };

  
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "from-green-500 to-green-600";
    if (confidence >= 50) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10,30 Q50,10 90,30 T90,60 T50,90 T10,60 T50,30"
                stroke="white"
                fill="none"
                strokeWidth="0.5"
              />
              <circle cx="20" cy="20" r="1" fill="white" />
              <circle cx="80" cy="30" r="1" fill="white" />
              <circle cx="50" cy="70" r="1" fill="white" />
              <circle cx="30" cy="50" r="1" fill="white" />
              <circle cx="70" cy="80" r="1" fill="white" />
              <circle cx="90" cy="10" r="1" fill="white" />
              <path
                d="M30,10 L40,20 L30,30 L20,20 Z"
                fill="white"
                fillOpacity="0.3"
              />
              <path
                d="M70,60 L80,70 L70,80 L60,70 Z"
                fill="white"
                fillOpacity="0.3"
              />
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                AI Health Prediction
              </h1>
              <p className="text-blue-100 max-w-xl">
                Our advanced machine learning algorithm analyzes your symptoms
                to identify potential health conditions. Select your symptoms to
                begin.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur border border-blue-100 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Medical Disclaimer:</strong> This AI-powered prediction
                is for informational purposes only and should not replace
                professional medical advice. Always consult your doctor for
                proper diagnosis.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center">
                  <div className="mr-3 bg-blue-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">
                      Select Your Symptoms
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Be specific about the symptoms you're experiencing for
                      better prediction accuracy
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {initialLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search symptoms..."
                          className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-3 text-blue-500">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    
                    <div
                      className={`mb-6 relative ${
                        showPulse
                          ? "after:absolute after:inset-0 after:bg-blue-100/50 after:animate-pulse after:rounded-xl"
                          : ""
                      }`}
                    >
                      <AnimatePresence>
                        {selectedSymptoms.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              <span className="bg-blue-100 rounded-full w-5 h-5 inline-flex items-center justify-center mr-1 text-blue-600">
                                {selectedSymptoms.length}
                              </span>
                              Selected Symptoms:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedSymptoms.map((symptom) => (
                                <motion.span
                                  key={symptom}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm flex items-center shadow-sm"
                                >
                                  {symptom.replace(/_/g, " ")}
                                  <button
                                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={() => toggleSymptom(symptom)}
                                  >
                                    ×
                                  </button>
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    
                    <div className="bg-gray-50 p-4 rounded-xl max-h-96 overflow-y-auto border border-gray-100 shadow-inner">
                      {filteredSymptoms.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No symptoms match your search
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {filteredSymptoms.map((symptom) => (
                            <motion.div
                              key={symptom}
                              className="flex items-center"
                              whileHover={{
                                backgroundColor: "rgba(219, 234, 254, 0.4)",
                                borderRadius: "0.5rem",
                                paddingLeft: "0.5rem",
                                paddingRight: "0.5rem",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <input
                                type="checkbox"
                                id={symptom}
                                checked={selectedSymptoms.includes(symptom)}
                                onChange={() => toggleSymptom(symptom)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label
                                htmlFor={symptom}
                                className="ml-2 text-sm text-gray-700 capitalize cursor-pointer py-1.5 flex-1"
                              >
                                {symptom.replace(/_/g, " ")}
                              </label>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    
                    <div className="mt-6">
                      <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={selectedSymptoms.length === 0 || loading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                          selectedSymptoms.length === 0 || loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                        }`}
                        whileHover={{
                          scale:
                            selectedSymptoms.length === 0 || loading ? 1 : 1.02,
                        }}
                        whileTap={{
                          scale:
                            selectedSymptoms.length === 0 || loading ? 1 : 0.98,
                        }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Running AI Analysis...
                          </span>
                        ) : (
                          <>
                            <span className="flex items-center justify-center">
                              <svg
                                className="w-5 h-5 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16 15L14 17L16 19M14 17H20"
                                />
                              </svg>
                              Generate AI Prediction
                            </span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full border border-gray-100">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center">
                  <div className="mr-3 bg-indigo-100 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">
                      AI Analysis Results
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Powered by machine learning
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {prediction ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="mb-6 text-center">
                        <div className="relative inline-block">
                          <div
                            className={`w-24 h-24 rounded-full bg-gradient-to-r ${getConfidenceColor(
                              prediction.confidence
                            )} flex items-center justify-center text-white text-xl font-bold`}
                          >
                            {Math.round(prediction.confidence)}%
                          </div>
                          <div className="absolute -right-2 -top-2 bg-white rounded-full p-1 shadow-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          AI Confidence
                        </p>
                      </div>

                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-600">
                          Predicted Condition
                        </h3>
                        <motion.p
                          className="text-2xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          {prediction.disease.replace(/_/g, " ")}
                        </motion.p>
                        <div className="mt-1 flex justify-center">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            AI Analysis
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Symptoms Analysis:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {prediction.symptoms_provided.map((symptom) => (
                            <motion.span
                              key={symptom}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                            >
                              {symptom.replace(/_/g, " ")}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500"
                      >
                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600 mt-0.5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Healthcare Recommendation
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                              Based on the AI analysis, consider discussing
                              these results with your doctor. You can schedule
                              an appointment within the app.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full animate-pulse"></div>
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                            />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-base font-medium text-gray-900">
                        AI Analysis Ready
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
                        Select your symptoms from the panel and let our AI
                        analyze your health condition
                      </p>
                      <div className="mt-4 flex justify-center">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full inline-flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Powered by ML
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DiseasePredictionPage;
