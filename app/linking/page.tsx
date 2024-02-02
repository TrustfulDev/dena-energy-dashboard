import LinkCards from '@/app/linking/components/link-cards'

export default function Linking() {
    return (
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 h-full m-4 md:mb-6 md:mx-0 mt-0 md:flex-wrap md:overflow-y-auto">
            <LinkCards 
                src=""
                companyName="Energy Star Portfolio Manager"
                description="Energy Star is a program run by the U.S. Environmental Protection Agency and U.S. Department of Energy that promotes energy efficiency."
                list={["Login to your Energy Star Portfolio Manager", "Go to the Sharing Tab", "Step 3", "Step 4", "Step 5"]}
            />

            <LinkCards 
                src=""
                companyName="Pacific Gas and Electric Company"
                description="Pacific Gas and Electric Company (PG&E) is one of the largest combined natural gas and electric companies in the United States."
                list={["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]}
            />
        </div>
    )
}
  