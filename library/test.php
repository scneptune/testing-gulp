<?php 

namespace AwesomeTown;

class Foo
{
    //invalidate the braces brah
    public function bar()
    {
        return 'awesome';
    }
    private function foobar()
    {
        return $this->bar();
    }
}
