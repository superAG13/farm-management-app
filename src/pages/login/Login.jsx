import React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Layout from "./Layout";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const validateEmail = async (email) => {
    setEmailError(""); // Zresetuj komunikat o błędzie
    if (!email) {
      setEmailError("Email jest wymagany");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Nieprawidłowy format emaila");
      return false;
    }

    try {
      const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
      if (response.status === 404) {
        setEmailError("Email nie istnieje w bazie danych");
        return false;
      }
      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas weryfikacji emaila");
      }
      return true;
    } catch (error) {
      console.error("Błąd podczas walidacji emaila", error);
      setEmailError("Wystąpił błąd podczas walidacji emaila");
      return false;
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Hasło jest wymagane");
      return false;
    }
    if (password.length < 5) {
      setPasswordError("Hasło musi mieć przynajmniej 5 znaków");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    const isEmailValid = await validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password, rememberMe}),
      });

      const data = await response.json(); // Pobierz dane odpowiedzi niezależnie od statusu odpowiedzi

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        navigate("/strona-glowna");
      } else {
        // Obsłuż różne statusy odpowiedzi od serwera
        switch (response.status) {
          case 400:
            // Błędne żądanie
            setError(data.message || "Nieprawidłowe żądanie. Proszę sprawdzić wprowadzone dane.");
            break;
          case 401:
            // Nieautoryzowany
            setError(data.message || "Nieprawidłowy email lub hasło.");
            break;
          case 403:
            // Zakazany
            setError(data.message || "Nie masz uprawnień do logowania.");
            break;
          case 404:
            // Nie znaleziono
            setError(data.message || "Nie znaleziono użytkownika.");
            break;
          default:
            // Inne błędy
            setError(data.message || "Logowanie nie powiodło się. Proszę spróbować później.");
        }
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      setError("Wystąpił błąd podczas próby logowania. Proszę spróbować później.");
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
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
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
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
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
