## APIs
## I. USER
### 1. Login
    [POST] /api/user/login
### 2. Register
    [POST] /api/user/register
### 3. Show user porfolio
#### [GET] /api/user/:id
- Response:
    ```
    {
        status: 200,
        message: 'Successful!',
        data: {
            wallets: {
                fiat: [{
                    id: string,
                    currency: string,
                    balance: float
                }],
                stocks: [{
                    id: string,
                    symbol: string,
                    quantity: interger
                }]
        }
    }
    ```
## II. User Wallet APIs
* Each wallet should has:
    * type: 'fiat' or 'stock'
    * unique currency ('usd', 'cad', 'vnd', 'jpy'...)
    * unique stock symbol ('AAPL', 'IBM', 'TSLA' ...)
### 1. Create User Wallet
#### [POST] /api/wallet?type='fiat'
- Request params:
    ```
    {
        user_id: string,
        currency: string
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Created fiat wallet successfully!"
        data: {
            id: string,
            type: 'fiat',
            owner_id: string,
            currency: string,
            balance: float, // default: 0
        }

    }
    ```
#### [POST] /api/wallet?type='stock'
- Request params:
    ```
    {
        user_id: string,
        symbol: string
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Created wallet successfully!"
        data: {
            id: string,
            owner_id: string,
            type: 'stock',
            stock: {
                id: string,
                symbol: string,
                quantity: interger, // default: 0
            }
        }
    }
    ```
### 2. Update User Wallet
#### 3.1 Deposit fiat balance 
#### [UPDATE] /api/wallet/:id
- Request Params:
    ```
    {
        type: 'fiat',
        currency: string,
        quantity: float
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Deposit successfully!"
        data: {
            id: string,
            owner_id: string,
            type: 'fiat',
            currency: string,
            balance: float
        }

    }
    ```
#### 3.2 Update Stock balance 
#### [POST] /api/wallet/:id
- Request Params:
    ```
    {
        type: 'stock',
        stock_id: string,
        quantity: float
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Deposit successfully!"
        data: {
            id: string,
            owner_id: string,
            type: 'stock',
            stock: {
                id: string,
                symbol: string,
                quantity: interger
            }
        }

    }
    ```
### 4. Add buy/sell shares
#### [POST] /api/wallet/:id
- Request params:
    ```
    {
        type: 'stock',
        order_type: string, // 'BUY' | 'SELL'
        quantity: interger,
        price: float,
        currency: string,
    }
    ```

- Successful response:
    ```
    {
        status: 200,
        message: 'Successful!',
        data: {
             wallets: {
                fiat: [{
                    id: string,
                    currency: string,
                    balance: float
                }],
                stocks: [{
                    id: string,
                    symbol: string,
                    quantity: interger
                }]
        }
    }
    ```
## III. Stock APIs
### 1. Show all stock info
#### [GET] /api/stocks
- Successful response:
    ```
    {
        status: 200,
        message: 'Successful!'
        data: [{
            id: string,
            symbol: string,
            time: string,
            time_zone: string,
            interval: string,
            currency: string,
            o: float,
            c: float,
            h: float,
            l: float
        }]
    }
    ```
### 2. Get stocks info
#### [GET] /api/stock/:id
- Response:
    ```
    {
        status: 200,
        message: 'Successful!',
        data: {
            id: string,
            symbol: string,
            time: string,
            time_zone: string,
            interval: string,
            currency: string,
            o: float,
            c: float,
            h: float,
            l: float
        }
    }
    ```
### 3. Update stock price info
> This API should be run by a scheduled cron job
> INTRADAY INFO will be fetch from this source: [alphavantage](https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=5min&outputsize=full&apikey=AKWEU271H5V6USY4)
#### [UPDATE] /api/stocks/:id
- Request:
    ```
    {
        o: float,
        c: float,
        h: float,
        l: float,
        time: string
        currency: string
    }
    ```