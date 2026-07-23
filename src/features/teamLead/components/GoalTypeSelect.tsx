interface Props {

    value:string;

    onChange:(value:string)=>void;

}

export default function GoalTypeSelect({

    value,

    onChange

}:Props){

    return(

        <select

            value={value}

            onChange={(e)=>onChange(e.target.value)}

            className="w-full rounded-lg border p-2"

        >

            <option value="LONG_TERM">
                Long Term
            </option>

            <option value="ONGOING">
                Ongoing
            </option>

            <option value="URGENT">
                Urgent
            </option>

        </select>

    );

}