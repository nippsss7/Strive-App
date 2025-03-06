import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log(input);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials in the request
                body: JSON.stringify(input)
            })

            const data = await res.json()
            console.log(data)
            console.log(data.success)
            toast(data.message);

            if(data.success){
                navigate('/login');
            }

        } catch (error) {
            console.log(error)
            console.log("unable to signup")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="form flex items-center justify-center w-screen h-screen">
                <form onSubmit={signupHandler} className="border border-gray-200 rounded-3xl shadow-2xl p-8 py-12 w-full max-w-md">
                    <div>
                        <h1 className='text-3xl font-bold text-center mb-10'>Sign up</h1>
                    </div>
                    <div className='mb-5'>
                        <Label className="m-1">Username</Label>
                        <Input className="focus-visible:ring-transparent rounded-md mt-1" type="text" name="username" value={input.username} onChange={handleChange} />
                    </div>
                    <div className='mb-5'>
                        <Label className="m-1">Email</Label>
                        <Input className="focus-visible:ring-transparent rounded-md mt-1" type="email" name="email" value={input.email} onChange={handleChange} />
                    </div>
                    <div className='mb-5'>
                        <Label className="m-1">Password</Label>
                        <Input className="focus-visible:ring-transparent rounded-md mt-1" type="password" name="password" value={input.password} onChange={handleChange} />
                    </div>

                    {loading ? (
                        <div className='flex justify-center pt-4'>
                            <Button>
                                <Loader2 className="animate-spin" />
                                Please Wait
                            </Button>
                        </div>
                    ) : (
                        
                        <div className='flex justify-center pt-4'>
                            <Button type='submit' className="w-2/3">Sign up</Button>
                        </div>
                    )
                    }


                    <div className='text-center text-sm mt-3 text-gray-500'>
                        Already have an account?{" "}
                        <Link to="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </form>
            </div>

        </>
    )
}
export default Signup
