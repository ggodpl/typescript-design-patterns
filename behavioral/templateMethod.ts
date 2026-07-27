abstract class BaseView {
    protected prepareLayout() {
        console.log('BaseView layout prepared');
    }

    protected focus() {
        console.log('BaseView focused');
    }

    enter() {
        this.focus();
        this.prepareLayout();
        this.render();
    }

    protected abstract render(): void;
}

class MyView extends BaseView {
    override prepareLayout() {
        console.log('MyView layout prepared');
    }

    override render() {
        console.log('MyView rendered');
    }
}

const view = new MyView();
view.enter();