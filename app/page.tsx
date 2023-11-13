import LinkCards from '@/components/link-cards'

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 h-full m-4 md:mb-6 md:mx-0 mt-0 md:flex-wrap md:overflow-y-auto">
      <LinkCards 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Energy_Star_logo.svg/1200px-Energy_Star_logo.svg.png"
        companyName="Energy Star Portfolio Manager"
        description="Energy Star is a program run by the U.S. Environmental Protection Agency and U.S. Department of Energy that promotes energy efficiency."
        list={["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]}
      />

      <LinkCards 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Pacific_Gas_and_Electric_Company_%28logo%29.svg/1024px-Pacific_Gas_and_Electric_Company_%28logo%29.svg.png"
        companyName="Pacific Gas and Electric Company"
        description="Pacific Gas and Electric Company (PG&E) is one of the largest combined natural gas and electric companies in the United States."
        list={["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]}
      />
    </div>
  )
}
