import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId); // Simpan ID user
      navigate("/chat");
    } catch (error) {
      alert("Login gagal!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="grid w-full max-w-sm gap-4 p-8 shadow rounded-xl">
        <h2 className="text-xl text-center font-bold">Login</h2>
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <p className="text-xs text-zinc-600 text-center">
          You don't have account? 
          <Link to={"/register"} className="font-medium hover:text-zinc-900"> Register</Link>
        </p>
        <Button type="submit" className="hover:cursor-pointer">Login</Button>
      </form>
    </div>
  );
};

export default Login;
