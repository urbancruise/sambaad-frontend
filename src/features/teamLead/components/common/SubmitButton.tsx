interface Props{

    loading:boolean;

    title:string;

}

export default function SubmitButton({

    loading,

    title

}:Props){

    return(

        <button

            disabled={loading}

            className="rounded-lg bg-blue-600 px-4 py-2 text-white"

        >

            {

                loading

                ? "Saving..."

                : title

            }

        </button>

    );

}