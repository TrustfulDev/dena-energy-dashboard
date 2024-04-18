
import { revalidatePath, revalidateTag } from "next/cache"

export default async function action() {
    'use server'
    revalidateTag('energystar_properties');
}