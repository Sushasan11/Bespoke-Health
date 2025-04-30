import { useState } from "react";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "Bespoke Health has transformed how I manage my healthcare. The ease of scheduling appointments and the quality of doctors available is remarkable.",
      author: "Sarah Johnson",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "As a doctor, I appreciate how Bespoke Health streamlines the consultation process. The platform is intuitive and allows me to focus on patient care.",
      author: "Dr. Michael Chen",
      role: "Cardiologist",
      image: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      quote: "I've saved so much time using Bespoke Health for my family's medical needs. The prescription delivery feature is a game-changer!",
      author: "Emily Rodriguez",
      role: "Parent",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-lg">
            Real experiences from patients and healthcare providers who use our platform.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <svg 
              className="absolute text-blue-100 h-24 w-24 -top-6 -left-6 transform -rotate-12"
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>

            <div className="relative z-10">
              <div className="mb-8">
                <p className="text-xl md:text-2xl text-gray-800 italic">
                  "{testimonials[activeIndex].quote}"
                </p>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].author}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 h-3 w-3 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "bg-blue-600 w-8" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;