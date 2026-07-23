interface Props{

    startDate:string;

    dueDate:string;

    onStartChange:(value:string)=>void;

    onDueChange:(value:string)=>void;

}

export default function DateRangePicker({

    startDate,

    dueDate,

    onStartChange,

    onDueChange

}:Props){

    return(

        <div className="grid grid-cols-2 gap-4">

            <input

                type="date"

                value={startDate}

                onChange={(e)=>

                    onStartChange(e.target.value)

                }

            />

            <input

                type="date"

                value={dueDate}

                onChange={(e)=>

                    onDueChange(e.target.value)

                }

            />

        </div>

    );

}