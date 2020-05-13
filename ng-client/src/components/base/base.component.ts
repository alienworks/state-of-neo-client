export class BaseComponent {
    private subscriptions = [];

    clearSubscriptions() {
        for (let i = 0; i < this.subscriptions.length; i++) {
            const element = this.subscriptions[i];
            element.unsubscribe();
        }
    }

    addSubscription(any) {
        this.subscriptions.push(any);
    }
}
