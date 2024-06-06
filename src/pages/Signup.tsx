import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import Creato from "../assets/Creato-logo.jpg"
import Background from "../assets/Login-Background.png"

export function Signup() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] overflow-hidden">
        <div className="flex flex-col items-center justify-center pt-12 overflow-hidden">
            <div className="flex justify-center items-center"> 
                <img src={Creato} className=" w-[150px] rounded-[50%]" alt="" />
            </div>
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Signup</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your name and email below to create your account
                    </p>
                </div>
                <form>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John"
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="#"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" type="password" name="password" required autoComplete="current-password" />
                        </div>
                        <Button type="submit" className="w-full">
                            Signup
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Have an account? {" "}
                    <Link to="/login" className="underline">
                        login
                    </Link>
                </div>
            </div>
        </div>
        <div className="hidden bg-muted lg:block w-full overflow-hidden">
            <img
                src={Background}
                alt="Image"
                className="w-full  object-cover dark:brightness-[0.2] dark:grayscale"
            />
        </div>
    </div>
    
    )
}
