import React, {useState} from "react";
import Layout from "./Layout";
import {useNavigate} from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    potwierdzHaslo: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.haslo !== formData.potwierdzHaslo) {
      setErrors({...errors, potwierdzHaslo: "Passwords do not match!"});
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      // Handle response data
      console.log("User registered successfully");
      navigate("/login");
    } catch (error) {
      setErrors({...errors, submit: error.message});
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-center mb-6">Rejestracja</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="imie" className="block mb-2">
            Imię
          </label>
          <input type="text" id="imie" className="w-full p-2 border border-gray-300 rounded" name="imie" value={formData.imie} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="nazwisko" className="block mb-2">
            Nazwisko
          </label>
          <input
            type="text"
            id="nazwisko"
            className="w-full p-2 border border-gray-300 rounded"
            name="nazwisko"
            value={formData.nazwisko}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="haslo" className="block mb-2">
            Hasło
          </label>
          <input type="password" id="haslo" className="w-full p-2 border border-gray-300 rounded" name="haslo" value={formData.haslo} onChange={handleChange} required />
        </div>
        <div className="mb-6">
          <label htmlFor="potwierdzHaslo" className="block mb-2">
            Powtórz hasło
          </label>
          <input
            type="password"
            id="potwierdzHaslo"
            className="w-full p-2 border border-gray-300 rounded"
            name="potwierdzHaslo"
            value={formData.potwierdzHaslo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">
            ZAREJESTRUJ
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm">
            Masz już konto?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Zaloguj się
            </a>
          </p>
        </div>
      </form>
    </Layout>
  );
};

export default Register;
