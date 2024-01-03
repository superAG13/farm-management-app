import React, {useState} from "react";
import Layout from "./Layout";

function ForgotPassword() {
  const [formData, setFormData] = useState({email: ""});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      // Handle response data
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-center mb-6">Zapomniałeś hasła?</h2>
      <p className="text-sm text-center text-gray-600 mb-6">Żaden problem. Po prostu podaj nam swój adres e-mail, a my wyślemy Ci link do zresetowania hasła</p>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Wpisz swój e-mail"
          required
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className={`p-2 bg-green-500 hover:bg-green-600 text-white rounded`}>
          ZRESETUJ HASŁO
        </button>
      </form>
    </Layout>
  );
}

export default ForgotPassword;
