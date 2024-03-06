// Components
import LinkCards from '@/components/linking/link-cards';

// Images
import energystar from "@/images/EnergyStar_logo.svg";
import pge from "@/images/PG&E_logo.svg";
import ae from "@/images/ae-logo.webp";

const companies = [
    {
        img: energystar,
        api: "energystar",
        name: "Energy Star Portfolio Manager",
        description: "Energy Star is a program run by the U.S. Environmental Protection Agency and U.S. Department of Energy that promotes energy efficiency."
    },
    {
        img: pge,
        api: "",
        name: "Pacific Gas and Electric Company",
        description: "Pacific Gas and Electric Company (PG&E) is one of the largest combined natural gas and electric companies in the United States."
    },
    {
        img: ae,
        api: "",
        name: "AccuEnergy",
        description: "Accuenergy manufactures and designs industrial power and energy meter solutions. Perfect for sub-meters."
    },
]

export default function Linking() {
    return (
        <div className="grid grid-cols-4 gap-4 md:gap-6 h-full m-4 md:mb-6 md:mx-0 mt-0 xl:pr-6 md:flex-wrap md:overflow-y-auto">
            { companies.map((company, index) => (
                <LinkCards 
                    key={index}
                    src={company.img}
                    api={company.api}
                    companyName={company.name}
                    description={company.description}
                />
            ))}
        </div> 
    )
}