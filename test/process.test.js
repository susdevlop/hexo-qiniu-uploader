const { processSite } = require('../lib/process');
let context = null;
const cdnRoot = 'https://www.baidu.com';
beforeEach(() => {
  context = {
    config: {
      cdn: {
        url: cdnRoot,
      }
    }
  };
});

test('should use default image if no specify custom image', () => {
  const htmlContent = `<img src="data:image/png" />`;
  const actual = processSite.bind(context)(htmlContent);
  expect(actual).toBe(htmlContent);
});

test('should use default image if type a return key',()=>{
  const htmlContent = `            <p style="font-size: 30px; color:#fff;margin-top: 30px;"><img
                        src="/images/main/ic_address.png"
                        style="width: 50px;height: 50px;padding-right: 12px;"/>深圳市前海深港合作区前湾一路一号A栋
            </p>`;
  const actual = processSite.bind(context)(htmlContent);
  expect(actual).toMatch('https://www.baidu.com/images/main/ic_address.png')
})

