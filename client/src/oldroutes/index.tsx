export default function Index()
{
    return (
        <>
            <div id="navbar">
                <h1>My DVD Collection</h1>
                <div>
                    <form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search My Collections"
                            placeholder="Search My Collections"
                            type="search"
                            name="q"
                        />
                    </form>
                    <form method="post">
                        <button type="submit">New</button>
                    </form>
                </div>
            </div>
        </>
    );
}