import classes from './Layout.module.css';
import Header from './Header';

function Layout(props) {
    return (
        <div>
            <Header />
            <main className={classes.main}>{props.children}</main>
        </div>
    );
}

export default Layout;
