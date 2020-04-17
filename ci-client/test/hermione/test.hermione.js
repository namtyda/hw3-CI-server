describe('Тесты отображение', () => {

  it('Переход с history в settings', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .pause(1000)
      .click('.button__settings')
      .pause(2000)
      .click('.header__button_history')
      .assertExists('.settings__form', 'Форма с настройками появилась')
      .assertView('settingsFromHistory', 'body')
  });

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
      .pause(1000)
      .click('.button__settings')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
  });

  it('Страница history открывается, и можно сделать Run Build', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .pause(1000)
      .click('.button__settings')
      .pause(1500)
      .click('.button__header')
      .pause(1000)
      .click('#hash')
      .keys(['50edd056baf1d984a75b61acdef3f73050ffca49'])
      .pause(500)
      .click('.button__settings')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
  });

  it('Страница history открывается, и можно перейти на details', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .click('.button__settings')
      .pause(2000)
      .click('.card')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
  });

  it('Можно сделать rebuild на Details', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .pause(1000)
      .click('.button__settings')
      .pause(2000)
      .click('.card')
      .pause(2000)
      .click('.button__header')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
  });

  it('по клику на cancel переходит назад в history', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .pause(1000)
      .click('.button__settings')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
      .pause(500)
      .click('.header__button_history')
      .pause(500)
      .assertExists('.settings__form', 'Форма с настройками появилась')
      .assertView('historyToSettings', 'body')
  });
  it('С settings переходит назад в details', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .click('.button__settings')
      .pause(2000)
      .click('.card')
      .pause(1500)
      .click('.header__button_history')
      .pause(1500)
      .click('.button=Cancel')
      .pause(1500)
      .assertExists('.card', 'карточи не появились')
  });
});
