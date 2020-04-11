describe('Тесты отображение', () => {
  it('Страница Settings открывается, и проходит тесты', function () {
    return this.browser
      .url('/settings')
      .assertExists('.settings__form', 'Форма с настройками появилась')
      .assertView('plain', 'body');
  });

  it('Страница Settings открывается, и можно сохранить настройки', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .click('.button__settings')
      .pause(3000)
      .assertExists('.card', 'карточи не появились')
      .assertView('card', '.card', {
        ignoreElements: ['.card__number-ticket_queue']
      })
  });
});