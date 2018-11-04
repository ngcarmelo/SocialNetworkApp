import { MessagesModule } from './messages.module';

describe('MessagesModule', () => {
  let messagesModule: MessagesModule;

  beforeEach(() => {
    messagesModule = new MessagesModule();
  });

  it('should create an instance', () => {
    expect(messagesModule).toBeTruthy();
  });
});
