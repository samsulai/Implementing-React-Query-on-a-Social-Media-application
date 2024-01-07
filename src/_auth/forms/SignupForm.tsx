import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import {useNavigate} from "react-router-dom"

import {
  Form,
  FormControl,
 
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import {Link} from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccountMutation, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"



const SignupForm = () => {
 const navigate = useNavigate()
  const {toast} = useToast()
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
const {mutateAsync : createUserAccount, isPending : isCreatingUser} = useCreateUserAccountMutation()
const {mutateAsync : signInAccount, isPending : isSigningIn} = useSignInAccount()
const {checkAuthUser, isLoading : isUserLoading} = useUserContext()
async  function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)
   if(!newUser){
    return toast({
      title: "SignUp Failed.",
      
    })
   }
const session = await signInAccount(
  {
    email : values.email,
    password : values.password
  }
)
if(!session){
  return toast({
    title: "SignIn failed, please try again.",
    
  })
}

const isLoggedIn = await checkAuthUser()
if(isLoggedIn){
  form.reset()
   navigate('/')
}else{
  return toast({
    title: "SignIn failed, please try again...",
    
  })
}
  }
  return (


    <Form {...form}>
  <div className="sm:w-420 flex-center flex-col">
   <img src="/assets/images/logo.svg" alt="logo"/>
   <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
   <p className="text-medium text-light-3 md:base-regular mt-2">To use snapgram, enter your account details.</p>
   
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>name</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input" placeholder="Name" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input" placeholder="Username" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input" placeholder="Email" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" className="shad-input" placeholder="password" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="shad-button_primary">
      {isCreatingUser ? (
     <div className="flex-center gap-2">
      <Loader /> Loading...
     </div>
      ) : (
        'Sign Up'
      )}
      </Button>
      <p className="text-small-regular text-light-2 text-center">
Already have an account ? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
      </p>
    </form>
    </div>
  </Form>

  )
}

export default SignupForm