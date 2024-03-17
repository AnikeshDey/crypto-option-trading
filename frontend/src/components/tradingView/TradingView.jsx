import * as React from "react";
import {Helmet} from "react-helmet";

import "./TradingView.css";

// class App extends  React.Component {

//     componentDidMount() {
//         const script = document.createElement('script');
//         script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
//         script.async = true;
//         script.innerHTML = JSON.stringify({ / JSON object /});
//         document.getElementById("myContainer").appendChild(script);
//     }

//     render() {
//         return(
//       <div id="myContainer">
//         <div className="tradingview-widget-container">
//            <div className="tradingview-widget-container__widget">
//             </div>
//         </div>
//      </div>
//         );
//     }
// }

const TradingView = () => {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/html'
        script.src = 'https://in.tradingview.com/symbols/BTCUSDT/?exchange=BINANCE'
        //script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": "BINANCE:BTCUSDT",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "in",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_dbaca"
        });
        document.getElementById("myContainer").appendChild(script);
    }, []);

    return(
        <div id="myContainer">
            <div className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget">
            
                </div>
            </div>
        </div>
    );
}

export default TradingView;


{/* <Helmet>
            <html>
                <body>
                    
                
            <div class="tradingview-widget-container">
            <div id="tradingview_dbaca"></div>
            <div class="tradingview-widget-copyright"><a href="https://in.tradingview.com/symbols/BTCUSDT/?exchange=BINANCE" rel="noopener" target="_blank"><span class="blue-text">BTCUSDT Chart</span></a> by TradingView</div>
            <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
            <script type="text/javascript">
            {new TradingView.widget(
            {
            "autosize": true,
            "symbol": "BINANCE:BTCUSDT",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "in",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_dbaca"
            }
            )}
            </script>
            </div>
            </body>
            </html>
        </Helmet> */}
