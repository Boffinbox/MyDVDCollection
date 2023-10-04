// COMMON PATTERNS FOR UPDATING ARRAYS IN STATE
const shoppingCart =
    [
        { id: 1, product: "HDMI Cable", price: 4 },
        { id: 2, product: "Easy Bake Oven", price: 28 },
        { id: 3, product: "Peach Pie", price: 6.5 },
    ]

// ADDING TO AN ARRAY
const addToArray = [...shoppingCart, { id: 4, product: "Coffee Mug", price: 7.99 }];

// REMOVING AN ELEMENT
const deleteFromArray = shoppingCart.filter((item) => item.id !== 2);

// UPDATING ALL ELEMENTS IN AN ARRAY
const updateAllInArray = shoppingCart.map((item) => 
{
    return {
        ...item,
        product: item.product.toLowerCase()
    };
});

// MODIFY A PARTICULAR ELEMENT IN ARRAY
const modifyOneInArray = shoppingCart.map((item) =>
{
    if (item.id === 3)
    {
        return { ...item, price: 10.99 }
    }
    else
    {
        return item;
    }
})