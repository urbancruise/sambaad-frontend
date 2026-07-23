import { Inbox } from "lucide-react";

interface Props {
    title: string;
    description: string;
}

export default function EmptyState({
    title,
    description,
}: Props) {

    return (

        <div className="py-10 flex flex-col items-center justify-center text-center">

            <Inbox
                size={48}
                className="text-slate-300 mb-4"
            />

            <h3 className="font-semibold text-slate-700">
                {title}
            </h3>

            <p className="text-slate-500 text-sm mt-2">
                {description}
            </p>

        </div>

    );

}