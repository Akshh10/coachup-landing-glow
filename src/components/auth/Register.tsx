import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student'); // Default to Student

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error signing up:', error.message);
      return;
    }

    if (data.user) {
      // Add role and name to the profile
      await supabase.from('profiles').insert([
        { id: data.user.id, full_name: fullName, role }
      ]);
      alert(`Welcome, ${fullName}!`);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input type="text" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="Student">Student</option>
        <option value="Tutor">Tutor</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Register;
