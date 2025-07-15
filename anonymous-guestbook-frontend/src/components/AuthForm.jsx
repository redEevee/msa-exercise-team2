import React, { useState } from "react";
import "../styles/AuthForm.css";
import {
    FaGoogle,
    FaGithub,
    FaHeart,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaBehance
} from "react-icons/fa";

const AuthForm = () => {
    const [mode, setMode] = useState("signin");
    const [form, setForm] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleReset = () => {
        setForm({ email: "", password: "", repeatPassword: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === "signup" && form.password !== form.repeatPassword) {
            alert("Passwords do not match!");
            return;
        }
        alert(`${mode === "signin" ? "Logging in" : "Registering"} with ${form.email}`);
    };

    return (
        <div className="container">
            <h1>{mode === "signin" ? "SIGN IN" : "SIGN UP"}</h1>
            <ul className="links">
                <li style={{ opacity: mode === "signin" ? 1 : 0.6 }}>
                    <a href="#" id="signin" onClick={() => setMode("signin")}>SIGN IN</a>
                </li>
                <li style={{ opacity: mode === "signup" ? 1 : 0.6 }}>
                    <a href="#" id="signup" onClick={() => setMode("signup")}>SIGN UP</a>
                </li>
                <li style={{ float: "right" }}>
                    <a href="#" id="reset" onClick={handleReset}>RESET</a>
                </li>
            </ul>

            <form onSubmit={handleSubmit}>
                <div className={`input__block ${mode === "signup" ? "signup-input__block" : "first-input__block"}`}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input__block">
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        id="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {mode === "signup" && (
                    <div className="input__block">
                        <input
                            type="password"
                            placeholder="Repeat password"
                            className="input repeat__password"
                            id="repeatPassword"
                            value={form.repeatPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <button className="signin__btn" type="submit">
                    {mode === "signin" ? "Sign in" : "Sign up"}
                </button>
            </form>

            <div className="separator">
                <p>OR</p>
            </div>

            <button className="google__btn">
                <FaGoogle style={{ marginRight: "8px" }} />
                Sign in with Google
            </button>

            <button className="github__btn">
                <FaGithub style={{ marginRight: "8px" }} />
                Sign in with GitHub
            </button>

        </div>
    );
};

export default AuthForm;