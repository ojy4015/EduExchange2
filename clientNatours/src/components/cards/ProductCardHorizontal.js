import moment from 'moment';
import { useCart } from '../../context/cart';

export default function ProductCardHorizontal({ p, remove = true }) {

  //context
  const [cart, setCart] = useCart();

  const removeFromCart = (productId) => {
    let myCart = [...cart];
    let index = myCart.findIndex((item) => item._id === productId);
    myCart.splice(index, 1);
    setCart(myCart);
    localStorage.setItem('cart', JSON.stringify(myCart));
  };

  return (
    <div
      className="card mb-3"
    //style={{ maxwidth: 540 }}
    >
      <div>
        <div className="card-horizontal">
          <div className="img-square-wrapper">
            <img src={`${process.env.REACT_APP_API}/tours/photo/${p._id}`}
            alt={p.name} />
          </div>
          <div className="card-body">
            <h4 className="card-title">{p.name}</h4>
            <p className="card-text">      
              {
                (p?.description?.length > 160)
                  ? `${p?.description?.substring(0, 160)}...`
                  : `${p?.description?.substring(0, 160)}`
              }       
            </p>
            <h4 className="fw-bold">
            {p?.price?.toLocaleString("ko", {
              style: "currency",
              currency: "KRW",
            })}
        </h4>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <small className="text-muted">Listed {moment(p.createdAt).format('YYYY MM DD HH:mm')}</small>
          {remove && (
                  <p className="text-danger mb-2 pointer"
                      onClick={() => removeFromCart(p._id)}
                  >
                      Remove
                  </p>
              )
          }
        </div>
      </div>

      {/* <div className="row g-0">
        <div className="col-md-4">
          <img src={`${process.env.REACT_APP_API}/tours/photo/${p._id}`}
            alt={p.name}
            style={{
              height: '150px',
              width: "150px",
              objectFit: 'cover',
              marginLeft: '-12px',
              borderTopRightRadius: "0px",
            }}
          />
        </div>
        <div className='col-md-8'>
          <div className='card-body'>
            <h5 className='card-title'>
              {p.name}
            </h5>
            <p className="card-text">
              {
                (p?.description?.length > 160)
                  ? `${p?.description?.substring(0, 160)}...`
                  : `${p?.description?.substring(0, 160)}`
              }
            </p>
            <h4 className="fw-bold">{p.price?.toLocaleString("ko", {
              style: "currency",
              currency: "KRW",
            })}
            </h4>

          </div>
        </div>

              <div className="d-flex justify-content-between">
                  <p className="card-text">
                      <small className="text-muted">
                          Listed {moment(p.createdAt).fromNow()}
                      </small>
                  </p>
                  {remove && (
                          <p className="text-danger mb-2 pointer"
                              onClick={() => removeFromCart(p._id)}
                          >
                              Remove
                          </p>
                      )
                  }
              </div>
      </div> */}

    </div>
  );
}