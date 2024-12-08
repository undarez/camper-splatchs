import { useState } from "react";

export const useAuthForm = () => {
  // États pour le formulaire d'authentification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");

  // États pour le formulaire de profil
  const [name, setName] = useState("");
  // const [department, setDepartment] = useState("");
  const [age, setAge] = useState("");
  const [camperModel, setCamperModel] = useState("");
  const [usageFrequency, setUsageFrequency] = useState("");

  // Gestion des changements pour les champs d'authentification
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaValue(value);
    }
  };

  // Gestion des changements pour les champs du profil
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // const handleDepartmentChange = (value: string) => {
  //   setDepartment(value);
  // };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

  const handleCamperModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCamperModel(e.target.value);
  };

  const handleUsageFrequencyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsageFrequency(e.target.value);
  };

  // Validation des mots de passe
  const validatePasswords = () => {
    return password === confirmPassword;
  };

  return {
    // États pour l'authentification
    email,
    password,
    confirmPassword,
    captchaValue,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleCaptchaChange,
    validatePasswords,

    // États pour le profil
    name,
    // department,
    age,
    camperModel,
    usageFrequency,
    handleNameChange,
    // handleDepartmentChange,
    handleAgeChange,
    handleCamperModelChange,
    handleUsageFrequencyChange,
  };
};
