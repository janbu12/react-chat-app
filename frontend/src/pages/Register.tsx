import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State untuk menangkap error
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error sebelum submit

    try {
      await axios.post("http://localhost:5001/auth/register", { username, password });
      alert("Registrasi berhasil!");
      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.error);
      } else {
        setError("Terjadi kesalahan, coba lagi nanti.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="grid w-full max-w-sm gap-4 p-8 shadow rounded-xl">
        <h2 className="text-xl text-center font-bold">Register</h2>
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">Register</Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Register;
