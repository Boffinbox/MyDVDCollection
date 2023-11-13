class ExpressError extends Error
{
    status: number;
    message: string;
    constructor(status, message)
    {
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;