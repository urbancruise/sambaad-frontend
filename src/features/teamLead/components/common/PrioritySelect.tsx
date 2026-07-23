interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function PrioritySelect({
    value,
    onChange
}: Props) {

    return (

        <select
            value={value}
            onChange={(e)=>onChange(e.target.value)}
            className="w-full rounded-lg border p-2"
        >

            <option value="LOW">Low</option>

            <option value="MEDIUM">Medium</option>

            <option value="HIGH">High</option>

            <option value="CRITICAL">Critical</option>

        </select>

    );

}