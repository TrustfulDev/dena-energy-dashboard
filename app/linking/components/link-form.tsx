"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    id: z.string().min(1, "ID is required"),
    id2: z.string().min(1, "ID2 is required"),

});

export const LinkForm: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/energystar/linking/`, {
                method: 'POST',
                //body: values.id,
                body: JSON.stringify({ id: values.id, id2: values.id2 }), 

            });

            if (res.ok) {
                toast.success("Account Found!", {
                    description: `Your account [${values.id}] is linked with us.`
                })
            } else {
                toast.error("No Account Found!", {
                    description: `Your account [${values.id}] is not linked with us.`,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xl">Check if your account is already linked to us!</FormLabel>

                            <FormControl>
                                <Input disabled={loading} placeholder="Energy Star Account ID" {...field} />
                            </FormControl>

                            <FormDescription>
                                Find your account ID in Account Settings --&gt; About Yourself
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="id2" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ID 2</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Enter ID 2" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button disabled={loading} variant="outline" type="submit" className="border-2 border-primary">Check ID</Button>
            </form>
        </Form>
    )
}