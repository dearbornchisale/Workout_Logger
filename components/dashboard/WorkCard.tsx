type WorkoutCardProps = {
    name: string,
    date: string,
};

export default function WorkoutCard({
    name,
    date,
}: WorkoutCardProps) {
    return (
        <div className=" flex items-center justisy-between border-b py-4 ">
            <p className="font-medium"> {name} </p>
            <p className="text-sm text-gray-500 "> {date} </p>
        </div>
    );

}