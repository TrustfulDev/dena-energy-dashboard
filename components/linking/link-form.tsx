"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";

const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),

});

interface LinkFormProps {
    api: string,
    callback: Function,
    disable?: boolean,
}

export const LinkForm: React.FC<LinkFormProps> = ({
    api,
    callback,
    disable
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/${api}/linking/`, {
                method: 'POST',
                body: JSON.stringify({ 
                    username: values.username, 
                    password: values.password,
                    firstname: user?.firstName,
                    lastname: user?.lastName,
                    userId: user?.id
                }), 
            });

            if (res.ok) {
                callback(values.username);
                toast.success("Account Linked!", {
                    description: `Your account [${values.username}] is now linked with us.`
                })
                router.refresh();
            } else if (res.status === 409) {
                toast.error("Account Already Linked!", {
                    description: "You already have an account linked with us."
                })
            } else {
                console.log(res.status);
                toast.error("Account Authentication Failed!", {
                    description: `Your account [${values.username}] does not exist.`,
                })
            }
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="font-bold ml-3 absolute -top-[7px] bg-background px-2">USERNAME</FormLabel>

                            <FormControl>
                                <Input disabled={loading || disable} placeholder="Enter Username" {...field} className="!mt-1 !py-6" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password" 
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="font-bold ml-3 absolute -top-[7px] bg-background px-2">PASSWORD</FormLabel>
                            <FormControl>
                                <Input disabled={loading || disable} placeholder="Enter Password" type="password" {...field} className="!mt-1 !py-6" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button disabled={loading || disable} variant="outline" type="submit" className="border-2 border-primary">Link Account</Button>
            </form>
        </Form>
    )
}