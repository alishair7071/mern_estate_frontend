import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp= ()=>{
    const API_BASE_URL = process.env.BACKEND_URL_DEPLOYED_VERCEL; 

    const [formData, setFormData] =useState({});
    const [loading, setLoading]= useState(false);
    const [error, setError]= useState(null);
    const navigate= useNavigate();


    const handleChange= (e)=>{
         setFormData({
            ...formData,
            [e.target.id]: e.target.value
         })
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const response= await fetch(`${API_BASE_URL}/auth/sign-up`,
                {
                    method :"POST",
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );
            const jsonData= await response.json();
            if(jsonData.success===false){
                setError(jsonData.message);
                setLoading(false);
                return;
            }
            console.log(jsonData);
            setLoading(false);
            setError(null);
            navigate('/sign-in');
    
        } catch(e){
            console.log(e.message);
        }
        
    }


    return (
        <div className="flex justify-center">
        <div className="w-lg">
            <h1 className="text-3xl text-center font-semibold my-7">SignUp</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="  userName"
                 className=" bg-white border p-1.5 rounded-lg" id="userName" onChange={handleChange}/>
                 
                <input type="text" placeholder="  email"
                 className=" bg-white border p-1.5 rounded-lg" id="email" onChange={handleChange}/>
                 
                <input type="password" placeholder="  password"
                 className=" bg-white border p-1.5 rounded-lg" id="password" onChange={handleChange}/>

                 <button disabled={loading} type="submit" className="bg-slate-700 hover:opacity-90
                  text-white uppercase p-2 rounded-lg disabled:opacity-40">{(loading) ? 'loading...' : 'Sign up'}</button>
            </form>

            <div className="flex gap-2 mt-3">
            <p>Have an account?</p>
                <Link to={'/sign-in'}>
                <span className="text-blue-600 hover:underline">Sign-in</span>
                </Link>
            </div>
            <div>
                {(error) && <p className="text-red-500">{error}</p>}
            </div>
        </div>
        </div>

    );
}

export default SignUp;