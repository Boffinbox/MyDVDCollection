export default function ErrorPage(error: any)
{
    return (
        <div>
            <h1>:(</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p><a href="/home">Click here</a> to go to the homepage, or contact the administrator.</p>
        </div>
    );
}