'use client'
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-client"


export default function LoginButton(){

    const supabase = createClient();

    const handleGoogleLogin = async () => { 

    const { data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
        redirectTo: `${window.location.origin}/auth/callback`,
    }
    });

    if (error) {
        console.log(error.message);
        return;
    }
}

return <Button onClick = {handleGoogleLogin} className="rounded-lg bg-black px-6 py-3 font-medium text-white"> Sign In With Google </Button>

}

