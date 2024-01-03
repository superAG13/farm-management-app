import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Layout from "./Layout";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password, rememberMe}),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      navigate("/strona-glowna");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-center mb-6">Logowanie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 border-gray-300 rounded" />
            <label htmlFor="rememberMe" className="ml-2 text-sm font-medium">
              Zapamiętaj mnie
            </label>
          </div>
          <div className="text-sm">
            <a href="/forgot-password" className="font-medium text-blue-600 hover:underline">
              Nie pamiętasz hasła?
            </a>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          ZALOGUJ
        </button>
        <div className="text-center text-sm">
          <p>
            Nie masz konta?{" "}
            <a href="/register" className="font-medium text-blue-600 hover:underline">
              Zarejestruj się!
            </a>
          </p>
        </div>
      </form>
    </Layout>
  );
};

export default Login;
