abstract class BaseView {
    protected prepareLayout() {
        console.log('BaseView layout prepared');
    }

    protected focus() {
        console.log('BaseView focused');
    }

    // The template method defines an algorithm skeleton (in this case, entering a view)
    // It contains a few steps, which can vary depending on the implementation... 
    enter() {
        this.focus();
        this.prepareLayout();
        this.render();
    }

    // ...or, in some cases, WILL vary
    protected abstract render(): void;
}

class MyView extends BaseView {
    // MyView can override existing steps...
    override prepareLayout() {
        console.log('MyView layout prepared');
    }

    // ...or implement the abstract ones
    override render() {
        console.log('MyView rendered');
    }
}

const view = new MyView();
view.enter();