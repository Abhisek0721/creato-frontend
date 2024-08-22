import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Creato from "../assets/Creato-logo.jpg";
import Background from "../assets/Login-Background.png";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserSignUpMutation } from "../Redux/feature/authApi";
import { useUserResendVerificationMailMutation } from "../Redux/feature/authApi";
import { Spinner } from "../spinner";
import openEye from "../assets/open-eye.svg";
import closeEye from "../assets/closed-eye.svg";
import cross from "../assets/cross.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ResendverifyUser } from "../Redux/util/InterfaceTypes";
import { isUSerVerified } from "../Redux/util/getUserDetailFromBrowser";
import { setIsUserVerified } from "../Redux/util/getUserDetailFromBrowser";

const formSchema = z.object({
  full_name: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Invalid Email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const popupformSchema = z.object({
  email: z.string().email({
    message: "Invalid Email",
  }),
});

export function Signup() {
  const [show, setshow] = useState<Boolean>(false);
  const [showResendVerification, setshowResendVerification] =
    useState<Boolean>(false);
  const [isOpen, setisOpen] = useState<Boolean>(false);
  const [timer, settimer] = useState(0);
  const [isdisabled, setisdisabled] = useState(false);
  const [isverified, setisverified] = useState(false);
  const [isemail, setemail] = useState("");

  const [loginfn, { isLoading: isloginloading }] = useUserSignUpMutation();
  const [verifyfn, { isLoading: isverifyloading }] =
    useUserResendVerificationMailMutation();

  //function for timer
  useEffect(() => {
    let interval = null;

    if (isdisabled && timer > 0) {
      interval = setInterval(() => {
        settimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [timer, isdisabled]);

  const handleTimer = () => {
    settimer(60);
    setisdisabled(!isdisabled);
    setTimeout(() => {
      setisdisabled(false);
    }, 60000);
  };

  //validation schema for form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  //validation schema for Popupform
  const popupform = useForm<z.infer<typeof popupformSchema>>({
    resolver: zodResolver(popupformSchema),
    defaultValues: {
      email: "",
    },
  });

  //handler for form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await loginfn(values);
      console.log(response);
      if (response?.error) {
        toast.error(`${response?.error?.data?.message}`, { duration: 5000 });
        setisverified(!isverified);
      }

      if (response?.data) {
        setemail(response?.data?.data?.email);
        setIsUserVerified(false);
        toast.success(`${response?.data?.message}`, { duration: 5000 });
        setshowResendVerification(true);
        handleTimer();
      }
    } catch (error: any) {
      toast.error(`${error}`, { duration: 5000 });
    }
  }

  const UserVerified = isUSerVerified(); //check userVerified or not

  const handleVerificationMail = async () => {
    if (!UserVerified) {
      const email = { email: `${isemail}` };
      const response = await verifyfn(email);
      if (response?.error)
        toast.error(`${response?.error?.data?.message}`, { duration: 5000 });
      if (response?.data) {
        toast.success(`${response?.data?.message}`, { duration: 5000 });
        handleTimer();
      }
      return;
    }
    return toast.error("User already Verified", { duration: 5000 });
  };

  //handler for PopupForm
  async function onPopUpSubmit(Popvalues: z.infer<typeof popupformSchema>) {
    if (!UserVerified) {
      const email: ResendverifyUser = { email: Popvalues.email };
      const response = await verifyfn(email);
      if (response?.error)
        toast.error(`${response?.error?.data?.message}`, { duration: 5000 });
      if (response?.data) {
        toast.success(`${response?.data?.message}`, { duration: 5000 });
        handleTimer();
        setisOpen(!isOpen);
      }
      return;
    }

    return toast.error("User already Verified", { duration: 5000 });
  }

  return (
    <>
      {(isloginloading || isverifyloading) && <Spinner />}
      <div className="w-full flex justify-between items-center overflow-hidden">
        <div className="fixed top-1 left-4">
          {" "}
          <img src={Creato} className=" w-[80px] rounded-[50%]" alt="" />
        </div>

        <div className="lg:min-w-[30%] my-auto mx-auto px-3">
          <div className="text-center py-6">
            <h1 className="text-3xl font-bold py-4">Signup</h1>
            <p className="text-balance text-muted-foreground">
              Set up your account to start using Creato
            </p>
          </div>

          <Form {...form}>
            <form className="py-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="shadcn"
                            {...field}
                            autoComplete="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="shadcn@gmail.com"
                            {...field}
                            autoComplete="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="....."
                              {...field}
                              type={show ? "input" : "password"}
                              autoComplete="true"
                            />
                            <div
                              className="absolute top-3 right-3 cursor-pointer"
                              onClick={() => setshow(!show)}
                            >
                              <img src={show ? openEye : closeEye} alt="" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className=" mt-[-0.5rem]  text-sm text-muted-foreground flex justify-between ">
                    <div>{isdisabled ? `Didn't get Email  ${timer}` : ""}</div>
                    {showResendVerification ? (
                      <Link
                        to="#"
                        onClick={() => handleVerificationMail()}
                        className={isdisabled ? `hidden` : `block`}
                      >
                        Resend verification Email
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className={`w-full bg-secondary ${
                    showResendVerification ? "hidden" : ""
                  }`}
                  disabled={isverified}
                >
                  Signup
                </Button>
                <Button
                  variant="outline"
                  className={`w-full  ${
                    showResendVerification ? "hidden" : ""
                  }`}
                  disabled={isverified}
                >
                  Sign up with Google
                </Button>
              </div>
            </form>
          </Form>

          {isOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3 relative mx-4">
                <div className="py-6">
                  <div className="text-xl font-semibold mb-4 absolute top-2 text-start ">
                    Resend Verification Email
                  </div>
                  <img
                    src={cross}
                    alt=""
                    className="absolute right-3 top-2 cursor-pointer"
                    onClick={() => setisOpen(!isOpen)}
                  />
                </div>
                <Form {...popupform}>
                  <form onSubmit={popupform.handleSubmit(onPopUpSubmit)}>
                    <div className="mb-4">
                      <FormField
                        control={popupform.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="shadcn@gmail.com"
                                {...field}
                                autoComplete="true"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Button type="submit" className="w-full">
                        Resend email
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            have an account?{" "}
            <Link to="/login" className="underline">
              login
            </Link>
          </div>
          {isverified ? (
            <div
              className={`mt-1 text-center text-sm ${
                isdisabled ? `hidden` : `block`
              }`}
            >
              Didn't verified?{" "}
              <Link
                to="#"
                className="underline"
                onClick={() => setisOpen(!isOpen)}
              >
                click to verify
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="hidden lg:block overflow-hidden w-[60%] h-[100vh] bg-primary">
          <img
            src={Background}
            alt="Background Image"
            className="dark:brightness-[0.2] dark:grayscale w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
}
