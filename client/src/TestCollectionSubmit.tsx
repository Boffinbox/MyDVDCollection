import axios from "axios";

export function TestCollectionSubmit()
{
    function handleSubmit(evt: React.FormEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        console.log("Form submitted!");
        const userData =
        {
            title: "my new collection"
        }
        axios.post("/api/disccollections", userData).then((response) =>
        {
            console.log("Post request sent.");
            console.log(response.data);
        }).catch((e) =>
        {
            console.log(e);
        })
    }

    return (
        <div>
            <div style={{ backgroundColor: "darkblue" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>basic form</p>
                    <button>Submit!</button>
                </form>
            </div>
        </div>
    )
}