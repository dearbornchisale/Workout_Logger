type StatCardProps = {
    title : string; 
    value : string | number;
};

export default function StatCard ({
    title,
    value,
}: StatCardProps){
    return(
        <div className="roundend-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-grey-500"> {title} </p>
            <p className=" mt-2 text-2xl font-bold">
                {value}
            </p>
        </div>

    );
}