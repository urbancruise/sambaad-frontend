interface Props {

    label: string;

    active: boolean;

    onClick: () => void;

}

export default function TabButton({

    label,

    active,

    onClick

}: Props) {

    return (

        <button

            onClick={onClick}

            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all

            ${

                active

                ? "bg-slate-900 text-white"

                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"

            }`}

        >

            {label}

        </button>

    );

}